import { useVuelidate } from "@vuelidate/core";
import _capitalize from "lodash/capitalize";
import _get from "lodash/get";
import _last from "lodash/last";
import _startCase from "lodash/startCase";
import { ref } from "vue";

/**
 * Simple wrapper for common Vuelidate operations.
 * Used this in combination with composition API.
 */
export const useVuelidation = ({ validations = {}, state = {} }) => {
  const $externalResults = ref({});
  const v$ = useVuelidate(validations, state, { $externalResults });
  let generalError = ref("");

  /**
   * Is the form being currently submitted.
   */
  const isSubmitting = ref(false);

  /**
   * Returns true if the given field is valid.
   */
  const isValid = (field: string) => !_get(v$.value, field).$invalid;

  const hasError = (field: string) => {
    const validation = _get(v$.value, field);
    return !isValid(field) && validation.$errors.length;
  };

  /**
   * Utility function to get the error message for the given field.
   */
  const getErrorMessage = (field: string): string => {
    const validation = _get(v$.value, field);
    // Check if the field has an error.
    if (hasError(field))
      return validation.$errors[0].$message.replace(
        "Value",
        _capitalize(_startCase(_last(field.split("."))))
      );

    // By default return no error message.
    return "";
  };

  const setErrors = (errors) => {
    if (typeof errors === "object") {
      $externalResults.value = errors;
    } else {
      generalError.value = errors;
    }
  };

  const submitForm =
    (callback, errorHandler = setErrors) =>
    async () => {
      v$.value.$clearExternalResults();
      v$.value.$touch();

      if (v$.value.$error) return;
      isSubmitting.value = true;

      try {
        await callback();
      } catch (error) {
        if (errorHandler) errorHandler(error);
      } finally {
        isSubmitting.value = false;
      }
    };

  return {
    submitForm,
    isSubmitting,
    isValid,
    getErrorMessage,
    setErrors,
    hasError,
    generalError,
    v$,
  };
};
