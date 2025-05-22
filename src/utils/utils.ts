import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Extracts the locale from form data with a fallback to the default locale.
 * @param {FormData} formData - The form data to extract the locale from.
 * @param {string} defaultLocale - The default locale to use if none is found in the form data.
 * @returns {string} The extracted locale or the default locale.
 */
export function getLocaleFromFormData(formData: FormData, defaultLocale: string = "en"): string {
  const locale = formData.get("locale")?.toString();
  return locale || defaultLocale;
}
