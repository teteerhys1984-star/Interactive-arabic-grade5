import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

afterEach(() => {
  window.sessionStorage.clear();
});
