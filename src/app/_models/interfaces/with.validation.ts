export interface WithValidation {
  addValidation(): void;

  hasError(key: string): boolean;

  getErrorMessage(key: string): string;

  getValidityClass(key: string): string;
}
