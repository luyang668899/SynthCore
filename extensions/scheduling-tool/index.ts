import { SchedulingManager } from "./src/scheduling-manager";

export function register() {
  const schedulingManager = new SchedulingManager();

  return {
    commands: {
      "create-job": async (args: {
        name: string;
        cron: string;
        command: string;
        args?: string[];
        enabled?: boolean;
      }) => {
        try {
          const job = schedulingManager.createJob(
            args.name,
            args.cron,
            args.command,
            args.args,
            args.enabled !== undefined ? args.enabled : true,
          );
          return {
            success: true,
            message: "Job created successfully",
            data: job,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to create job: ${(error as Error).message}`,
          };
        }
      },
      "list-jobs": async () => {
        try {
          const jobs = schedulingManager.listJobs();
          return {
            success: true,
            message: "Jobs listed successfully",
            data: jobs,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to list jobs: ${(error as Error).message}`,
          };
        }
      },
      "get-job": async (args: { id: string }) => {
        try {
          const job = schedulingManager.getJob(args.id);
          if (job) {
            return {
              success: true,
              message: "Job retrieved successfully",
              data: job,
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to get job: ${(error as Error).message}`,
          };
        }
      },
      "update-job": async (args: {
        id: string;
        name?: string;
        cron?: string;
        command?: string;
        args?: string[];
        enabled?: boolean;
      }) => {
        try {
          const updates: any = {};
          if (args.name !== undefined) updates.name = args.name;
          if (args.cron !== undefined) updates.cron = args.cron;
          if (args.command !== undefined) updates.command = args.command;
          if (args.args !== undefined) updates.args = args.args;
          if (args.enabled !== undefined) updates.enabled = args.enabled;

          const job = schedulingManager.updateJob(args.id, updates);
          if (job) {
            return {
              success: true,
              message: "Job updated successfully",
              data: job,
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to update job: ${(error as Error).message}`,
          };
        }
      },
      "delete-job": async (args: { id: string }) => {
        try {
          const deleted = schedulingManager.deleteJob(args.id);
          if (deleted) {
            return {
              success: true,
              message: "Job deleted successfully",
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to delete job: ${(error as Error).message}`,
          };
        }
      },
      "enable-job": async (args: { id: string }) => {
        try {
          const job = schedulingManager.enableJob(args.id);
          if (job) {
            return {
              success: true,
              message: "Job enabled successfully",
              data: job,
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to enable job: ${(error as Error).message}`,
          };
        }
      },
      "disable-job": async (args: { id: string }) => {
        try {
          const job = schedulingManager.disableJob(args.id);
          if (job) {
            return {
              success: true,
              message: "Job disabled successfully",
              data: job,
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to disable job: ${(error as Error).message}`,
          };
        }
      },
      "run-job": async (args: { id: string }) => {
        try {
          const result = await schedulingManager.runJob(args.id);
          if (result) {
            return {
              success: true,
              message: "Job executed successfully",
              data: result,
            };
          } else {
            return {
              success: false,
              message: "Job not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to run job: ${(error as Error).message}`,
          };
        }
      },
    },
  };
}
