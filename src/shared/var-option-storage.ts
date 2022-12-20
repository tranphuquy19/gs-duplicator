import { GitlabHttpClient } from './gitlab-http-client';
import { getProjectIdFromTemplateVar } from './gitlab-resource-extractor';

export class VarOptionStorage {
  private glHttpClient = GitlabHttpClient.getInstance();
  private static instance: VarOptionStorage;
  private options: { [key: string]: string[] } = {};

  private constructor() {}

  public static getInstance(): VarOptionStorage {
    if (!VarOptionStorage.instance) {
      VarOptionStorage.instance = new VarOptionStorage();
    }

    return VarOptionStorage.instance;
  }

  public async setOptions(options: { [key: string]: string[] }): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const key of Object.keys(options)) {
      const values = options[key];
      if (!!values) {
        for (let i = 0; i < values.length; i++) {
          const value = values[i];
          if (!!value) {
            if (value.match(/\$glProjectBranches\((\d+)?\)/)) {
              const projectId = getProjectIdFromTemplateVar(value);
              promises.push(
                this.glHttpClient.getProjectBranches(projectId).then((branches) => {
                  values.splice(i, 1, ...(branches || []));
                })
              );
            }
          }
        }
      }
    }
    await Promise.all(promises);
    this.options = options;
  }

  public getOptions(): { [key: string]: string[] } {
    return this.options;
  }

  public getOptionsByKey(key: string): string[] {
    return this.options[key] || [];
  }

  public hasOptions(): boolean {
    return Object.keys(this.options).length > 0;
  }

  public addOption(key: string, value: string): void {
    if (!this.options[key]) {
      this.options[key] = [];
    }

    if (this.options[key]?.indexOf(value) === -1) {
      this.options[key]?.push(value);
    }
  }

  public removeOption(key: string, value: string): void {
    if (!this.options[key]) {
      return;
    }

    const index = this.options[key]?.indexOf(value) || -1;
    if (index !== -1) {
      this.options[key]?.splice(index, 1);
    }
  }
}
