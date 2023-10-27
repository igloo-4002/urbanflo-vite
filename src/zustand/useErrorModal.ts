import { create } from 'zustand';


/**
 * Store definition for {@link useErrorModal}.
 *
 * @see useErrorModal
 */
type ErrorModalStore = {
  /**
   * Determines if the modal box is visible.
   */
  isOpen: boolean;
  /**
   * Heading for the modal box.
   */
  heading: string;
  /**
   * Body of the modal box.
   */
  body: string;
  /**
   * Open the modal box.
   * @param heading message heading
   * @param body message body
   */
  open: (heading: string, body: string) => void;
  /**
   * Close the modal box.
   */
  close: () => void;
};

/**
 * Zustand store for error modal box component.
 *
 * @see ErrorModal
 */
export const useErrorModal = create<ErrorModalStore>(set => ({
  isOpen: false,
  heading: '',
  body: '',
  open: (heading: string, body: string) => set({ isOpen: true, heading, body }),
  close: () => set({ isOpen: false }),
}));