import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "openclaw/plugin-sdk/core";
import { SkillManager, SkillResult } from "./src/skill-manager";

export class SkillPlugin implements OpenClawPlugin {
  private runtime: PluginRuntime;
  private skillManager: SkillManager;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.skillManager = new SkillManager(runtime);
  }

  async init() {
    await this.skillManager.init();
    this.runtime.log("Skill plugin initialized");
  }

  getTools(): Tool[] {
    return [
      {
        name: "skill_execute",
        description: "Execute a skill",
        parameters: {
          type: "object",
          properties: {
            skill: {
              type: "string",
              description: "Skill name (weather, news, calculator, translator)",
            },
            parameters: {
              type: "object",
              description: "Skill parameters",
            },
          },
          required: ["skill", "parameters"],
        },
        handler: async (ctx: ToolContext) => {
          const { skill, parameters } = ctx.parameters;
          return await this.skillManager.executeSkill(skill, parameters);
        },
      },
      {
        name: "skill_weather",
        description: "Get weather information",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Location to get weather for",
            },
          },
          required: ["location"],
        },
        handler: async (ctx: ToolContext) => {
          return await this.skillManager.executeSkill("weather", ctx.parameters);
        },
      },
      {
        name: "skill_news",
        description: "Get news information",
        parameters: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "News category (general, technology, business, etc.)",
            },
            country: {
              type: "string",
              description: "Country code (us, uk, ca, etc.)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          return await this.skillManager.executeSkill("news", ctx.parameters);
        },
      },
      {
        name: "skill_calculator",
        description: "Calculate mathematical expression",
        parameters: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "Mathematical expression to calculate",
            },
          },
          required: ["expression"],
        },
        handler: async (ctx: ToolContext) => {
          return await this.skillManager.executeSkill("calculator", ctx.parameters);
        },
      },
      {
        name: "skill_translator",
        description: "Translate text",
        parameters: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Text to translate",
            },
            targetLanguage: {
              type: "string",
              description: "Target language code",
            },
            sourceLanguage: {
              type: "string",
              description: "Source language code (auto by default)",
            },
          },
          required: ["text", "targetLanguage"],
        },
        handler: async (ctx: ToolContext) => {
          return await this.skillManager.executeSkill("translator", ctx.parameters);
        },
      },
      {
        name: "skill_config",
        description: "Get or update skill configuration",
        parameters: {
          type: "object",
          properties: {
            config: {
              type: "object",
              description: "Skill configuration (optional)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          const { config } = ctx.parameters || {};
          if (config) {
            return this.skillManager.updateConfig(config);
          } else {
            return this.skillManager.getConfig();
          }
        },
      },
      {
        name: "skill_list",
        description: "Get enabled skills",
        parameters: {},
        handler: async () => {
          return this.skillManager.getEnabledSkills();
        },
      },
    ];
  }

  getCommands() {
    return [];
  }

  getEventHandlers() {
    return [];
  }
}

export default SkillPlugin;
