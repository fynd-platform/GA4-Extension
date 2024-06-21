const dirtyCheckMixin = {
  beforeRouteLeave(to, from, next) {
    if (!this.isFormDirty) {
      console.warn(
        `Implement isDirtyForm() method in your component [${this.$options.name}] as you added dirty form mixin`
      );
      return;
    }
    if (this.isFormDirty()) {
      this.$__dirtyFormDialog.$on('close', e => {
        next(e === 'Leave');
      });

      this.$__dirtyFormDialog.open();
    } else {
      next(true);
    }
  },
};

export default dirtyCheckMixin;
