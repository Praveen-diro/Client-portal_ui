import ls from "localstorage-slim";
import { cookies } from "./cookie.service";
export type ThemeType = "light" | "dark";
export type DirectionType = "ltr" | "rtl";
export type PositionType = "fixed" | "absolute" | "relative";
export type LayoutType = "full" | "boxed" | "framed";
export type SidebarType = "full" | "mini" | "iconbar" | "overlay" | "hover";

export interface SettingsState {
  logoBg: string;
  navbarBg: string;
  sidebarBg: string;
  theme: ThemeType;
  direction: DirectionType;
  sidebarPosition: PositionType;
  headerPosition: PositionType;
  layout: LayoutType;
  sidebarType: SidebarType;
}

class SettingsService {
  private readonly STORAGE_KEY = "app_settings";
  private state: SettingsState;
  private subscribers: ((state: SettingsState) => void)[] = [];

  constructor() {
    // Initialize with default values or stored settings
    const defaultSettings: SettingsState = {
      logoBg: "white",
      navbarBg: "white",
      sidebarBg: "white",
      theme: "light",
      direction: "ltr",
      sidebarPosition: "fixed",
      headerPosition: "fixed",
      layout: "full",
      sidebarType: "full",
    };

    const savedSettings = cookies.get<SettingsState>(this.STORAGE_KEY);
    this.state = savedSettings || defaultSettings;
  }

  private setState(newState: Partial<SettingsState>): void {
    this.state = { ...this.state, ...newState };
    cookies.set(this.STORAGE_KEY, this.state);
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.state));
  }

  subscribe(callback: (state: SettingsState) => void): () => void {
    this.subscribers.push(callback);
    callback(this.state); // Initial call with current state

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  getState(): SettingsState {
    return { ...this.state };
  }

  setLogoBg(color: string): void {
    this.setState({ logoBg: color });
  }

  setNavbarBg(color: string): void {
    this.setState({ navbarBg: color });
  }

  setSidebarBg(color: string): void {
    this.setState({ sidebarBg: color });
  }

  setTheme(theme: ThemeType): void {
    this.setState({ theme });
  }

  setDirection(direction: DirectionType): void {
    this.setState({ direction });
  }

  setSidebarPosition(position: PositionType): void {
    this.setState({ sidebarPosition: position });
  }

  setHeaderPosition(position: PositionType): void {
    this.setState({ headerPosition: position });
  }

  setLayout(layout: LayoutType): void {
    this.setState({ layout });
  }

  setSidebarType(type: SidebarType): void {
    this.setState({ sidebarType: type });
  }

  resetToDefaults(): void {
    this.setState({
      logoBg: "white",
      navbarBg: "white",
      sidebarBg: "white",
      theme: "light",
      direction: "ltr",
      sidebarPosition: "fixed",
      headerPosition: "fixed",
      layout: "full",
      sidebarType: "full",
    });
  }
}

export const settingsService = new SettingsService();
