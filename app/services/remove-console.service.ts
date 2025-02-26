/**
 * Service for managing console debugging functionality
 * Allows enabling/disabling different types of console outputs
 */
class ConsoleDebugService {
  private savedConsole: Console;

  constructor() {
    this.savedConsole = console;
  }

  /**
   * Configure console debugging behavior
   * @param debugOn - Whether debugging is enabled
   * @param suppressAll - Whether to suppress all console types
   */
  configureDebug(debugOn: boolean, suppressAll: boolean = false): void {
    if (debugOn === false) {
      // Suppress specific console methods
      console.warn = () => {};
      console.info = () => {};

      // Handle all console types based on suppressAll flag
      if (suppressAll) {
        console.info = () => {};
        console.warn = () => {};
      } else {
        console.info = this.savedConsole.info;
        console.warn = this.savedConsole.warn;
      }
    }
  }

  /**
   * Reset console to original state
   */
  resetConsole(): void {
    console = this.savedConsole;
  }

  /**
   * Disable all console output
   */
  disableAllConsole(): void {
    this.configureDebug(false, true);
  }

  /**
   * Enable all console output
   */
  enableAllConsole(): void {
    this.resetConsole();
  }
}

export const consoleDebugService = new ConsoleDebugService();

// For backward compatibility with existing code
export const GlobalDebug = (debugOn: boolean, suppressAll: boolean = false): void => {
  consoleDebugService.configureDebug(debugOn, suppressAll);
};
