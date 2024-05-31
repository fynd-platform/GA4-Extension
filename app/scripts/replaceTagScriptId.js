const convict = require('convict');
const axios = require('axios');

const { getFdkAsync } = require('../fdk/index');

const TagModel = require('../models/Tag');

// ** NOTE ** - Please double check for cookie and extension_base_url before running this script otherwise this script would not be able to find the tags you want to update after running it first time.

// node replaceTagScriptId.js  --cookie '<cookie>' --cookie_company 1 --extension_base_url https://8d92-14-142-183-234.ngrok-free.app

async function start() {
  console.log(`** STARTING ** `);

  let scriptConf = convict({
    cookie: {
      doc: 'cookie',
      format: String,
      env: 'COOKIE',
      arg: 'cookie',
      default: '',
    },
    cookieCompany: {
      doc: 'cookie_company',
      format: String,
      env: 'COOKIE_COMPANY',
      arg: 'cookie_company',
      default: '61',
    },
    extensionBaseUrl: {
      doc: 'extension_base_url',
      format: String,
      env: 'EXTENSION_BASE_URL',
      arg: 'extension_base_url',
      default: 'https://ga4.extensions.fynd.com',
    },
    urlScriptInjectionEndPoint: {
      doc: 'url_script_injection_end_point',
      format: String,
      env: 'URL_SCRIPT_INJECTION_END_POINT',
      arg: 'url_script_injection_end_point',
      default: '/api/v1/tag-manager',
    },
  });
  scriptConf = scriptConf.get();

  const fdk = await getFdkAsync();

  // name of tags used for injection in extension
  const injectableTagNames = ['ga4 script'];
  const cookie = `${scriptConf.cookie}`;

  let tags;
  let bodyData;
  let spoiledTags = [];

  const extensionBaseUrl = `${scriptConf.extensionBaseUrl}`;
  const urlScriptInjectionEndPoint = `${scriptConf.urlScriptInjectionEndPoint}`;

  const urlScriptInjection = extensionBaseUrl + urlScriptInjectionEndPoint;

  try {
    // Only fetching that tags which are enabled in local and having script id attached to them
    tags = await TagModel.find({ enabled: true }).lean().exec();
    console.log(`** Fetching local db tags having enabled as true...`);

    for (const tag of tags) {
      const platformClient = await fdk.getPlatformClient(tag.company_id);
      let fetchedTags;
      let foundTags = false;

      try {
        // Fetching all tags of core Application wise.
        fetchedTags = await platformClient
          .application(`${tag.application}`)
          .content.getInjectableTags();
      } catch (fetchingApplicationTagError) {
        // console.log("-- Fetching Application Tag Error : ", fetchingApplicationTagError);
        console.log(
          `* UNABLE TO FETCH Tags for Company ID : ${tag.company_id}, Application ID :${tag.application}`
        );
      }

      if (fetchedTags && fetchedTags?.tags && fetchedTags.tags?.length) {
        for (let i = 0; i < fetchedTags.tags.length; i++) {
          // Check if the tag names are same as declared in ga4 extension as we are getting all tags of that application (other extension tags)
          if (injectableTagNames.includes(fetchedTags.tags[i].name)) {
            foundTags = true;

            if (fetchedTags.tags[i]._id != tag.script_id) {
              // For tags having same script name (injectableTagNames) but different script id
              spoiledTags.push(tag);
            } else {
              // For duplicate entries of same application(sales channel), tags having same script name (injectableTagNames) and same script id
              spoiledTags = spoiledTags.filter(
                tag => fetchedTags.tags[i]._id != tag.script_id
              );
              // Checked if any tag present for the script id for that particular sales chanel then no further check is required.
              break;
            }
          }
        }
      }

      if (!foundTags) {
        // For tags present in local but not Present in core
        spoiledTags.push(tag);
        console.log(
          `* NOT found Tags for Company ID : ${tag.company_id}, Application ID :${tag.application}`
        );
      }
    }

    console.log('** Spoiled tags : ', spoiledTags);

    for (const tag of spoiledTags) {
      console.log(
        `** Replacing tag for : ${tag.company_id}, Application ID :${tag.application}`
      );

      bodyData = {
        ...tag,
        enabled: false,
      };

      // Making axios call to disable the extension - this will not work.

      try {
        const result = await axios.put(urlScriptInjection, bodyData, {
          headers: {
            'x-company-id': `${scriptConf.cookieCompany}`,
            cookie,
          },
        });
        // console.log("Result : ", result);
        console.log(
          `** Disabled for TAG of : ${tag.company_id}, Application ID :${tag.application}`
        );
      } catch (disablingTagError) {
        // console.log("-- Disabling Tag Error : ", disablingTagError);
        //  update enabled false
        const updatedTag = await TagModel.findOneAndUpdate(
          {
            _id: tag._id,
          },

          {
            $set: { enabled: false },
            $unset: { script_id: '' },
          },
          { new: true, upsert: true }
        );
        console.log(
          `** Disabled for TAG of : ${tag.company_id}, Application ID :${tag.application}`
        );
      }

      const { script_id, enabled, ...enableTag } = tag;
      bodyData = {
        ...enableTag,
        enabled: true,
      };

      // Making axios call to enable the extension.

      try {
        const result = await axios.put(urlScriptInjection, bodyData, {
          headers: {
            'x-company-id': `${scriptConf.cookieCompany}`,
            cookie,
          },
        });
        console.log(
          `* **** SUCCESSFULLY REPLACEd/ENABLE TAG for : ${tag.company_id}, Application ID :${tag.application}`
        );
        // console.log("Result : ", result);
      } catch (enablingTagError) {
        console.log('-- Enabling Tag Error : ', enablingTagError);
        console.log(
          `* **** UNABLE TO REPLACE/ENABLE TAG for : ${tag.company_id}, Application ID :${tag.application}`
        );
      }
    }

    console.log(`** ENDING ** `);
    process.exit(0);
  } catch (error) {
    console.log('Error in Script : ', error);
    process.exit(0);
  }
}

start();
