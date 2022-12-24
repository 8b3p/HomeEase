export default class ServiceProvider {
  private services: Map<string, any>;

  constructor() {
    this.services = new Map();
  }

  public register<T>(name: string, service: T) {
    this.services.set(name, service);
  }

  public get(name: string) {
    return this.services.get(name);
  }
}
