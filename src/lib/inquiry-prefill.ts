/** Lets any "Discuss this" link drop a starting line into the inquiry form's request field. */
export const PREFILL_EVENT = "tp:prefill-inquiry";

export function prefillInquiry(text: string) {
  window.dispatchEvent(new CustomEvent<string>(PREFILL_EVENT, { detail: text }));
}
