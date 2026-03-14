"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingManager = void 0;
const uuid_1 = require("uuid");
const cron_1 = require("cron");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class SchedulingManager {
  constructor() {
    this.jobs = [];
    this.executionHistory = [];
  }
  /**
   * Create a scheduled job
   * @param name Job name
   * @param cron Cron expression
   * @param command Command to execute
   * @param args Command arguments
   * @param enabled Enable job
   * @returns Created job
   */
  createJob(name, cron, command, args, enabled = true) {
    const job = {
      id: (0, uuid_1.v4)(),
      name,
      cron,
      command,
      args,
      enabled,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (enabled) {
      this.scheduleJob(job);
    }
    this.jobs.push(job);
    return job;
  }
  /**
   * Schedule a job using cron
   * @param job Job to schedule
   */
  scheduleJob(job) {
    if (job.cronJob) {
      job.cronJob.stop();
    }
    job.cronJob = new cron_1.CronJob(
      job.cron,
      async () => {
        await this.executeJob(job);
      },
      null,
      true,
    );
    job.nextRun = job.cronJob.nextDate().toJSDate();
  }
  /**
   * Execute a job
   * @param job Job to execute
   * @returns Execution result
   */
  async executeJob(job) {
    const timestamp = new Date();
    let output = "";
    let error = "";
    let exitCode = 0;
    try {
      const fullCommand = `${job.command}${job.args ? " " + job.args.join(" ") : ""}`;
      const result = await execAsync(fullCommand);
      output = result.stdout;
      error = result.stderr;
      exitCode = 0;
    } catch (err) {
      output = err.stdout || "";
      error = err.stderr || err.message;
      exitCode = err.code || 1;
    }
    job.lastRun = timestamp;
    job.updatedAt = timestamp;
    if (job.cronJob) {
      job.nextRun = job.cronJob.nextDate().toJSDate();
    }
    const executionResult = {
      jobId: job.id,
      output,
      error,
      exitCode,
      timestamp,
    };
    this.executionHistory.push(executionResult);
    return executionResult;
  }
  /**
   * List all scheduled jobs
   * @returns List of jobs
   */
  listJobs() {
    return this.jobs.map((job) => ({
      ...job,
      cronJob: undefined, // Exclude cronJob from output
    }));
  }
  /**
   * Get job by ID
   * @param id Job ID
   * @returns Job object or undefined
   */
  getJob(id) {
    const job = this.jobs.find((j) => j.id === id);
    if (job) {
      return {
        ...job,
        cronJob: undefined, // Exclude cronJob from output
      };
    }
    return undefined;
  }
  /**
   * Update job
   * @param id Job ID
   * @param updates Updates
   * @returns Updated job or undefined
   */
  updateJob(id, updates) {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index !== -1) {
      const job = this.jobs[index];
      const updatedJob = {
        ...job,
        ...updates,
        updatedAt: new Date(),
      };
      this.jobs[index] = updatedJob;
      // Reschedule if cron or enabled status changed
      if (updates.cron || updates.enabled !== undefined) {
        if (updatedJob.enabled) {
          this.scheduleJob(updatedJob);
        } else if (job.cronJob) {
          job.cronJob.stop();
          updatedJob.cronJob = undefined;
        }
      }
      return {
        ...updatedJob,
        cronJob: undefined, // Exclude cronJob from output
      };
    }
    return undefined;
  }
  /**
   * Delete job
   * @param id Job ID
   * @returns True if deleted
   */
  deleteJob(id) {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index !== -1) {
      const job = this.jobs[index];
      if (job.cronJob) {
        job.cronJob.stop();
      }
      this.jobs.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Enable job
   * @param id Job ID
   * @returns Updated job or undefined
   */
  enableJob(id) {
    return this.updateJob(id, { enabled: true });
  }
  /**
   * Disable job
   * @param id Job ID
   * @returns Updated job or undefined
   */
  disableJob(id) {
    return this.updateJob(id, { enabled: false });
  }
  /**
   * Run job immediately
   * @param id Job ID
   * @returns Execution result or undefined
   */
  async runJob(id) {
    const job = this.jobs.find((j) => j.id === id);
    if (job) {
      return await this.executeJob(job);
    }
    return undefined;
  }
  /**
   * Get job execution history
   * @param jobId Optional job ID to filter by
   * @returns Execution history
   */
  getExecutionHistory(jobId) {
    if (jobId) {
      return this.executionHistory.filter((result) => result.jobId === jobId);
    }
    return this.executionHistory;
  }
  /**
   * Clear execution history
   * @param jobId Optional job ID to clear history for
   */
  clearExecutionHistory(jobId) {
    if (jobId) {
      this.executionHistory = this.executionHistory.filter((result) => result.jobId !== jobId);
    } else {
      this.executionHistory = [];
    }
  }
  /**
   * Stop all jobs
   */
  stopAllJobs() {
    this.jobs.forEach((job) => {
      if (job.cronJob) {
        job.cronJob.stop();
      }
    });
  }
  /**
   * Start all enabled jobs
   */
  startAllJobs() {
    this.jobs.forEach((job) => {
      if (job.enabled) {
        this.scheduleJob(job);
      }
    });
  }
}
exports.SchedulingManager = SchedulingManager;
