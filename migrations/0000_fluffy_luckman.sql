CREATE TYPE "public"."chart_library" AS ENUM('ECHARTS', 'RECHARTS', 'CHARTJS', 'VEGA');--> statement-breakpoint
CREATE TYPE "public"."file_kind" AS ENUM('CSV', 'XLSX');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."step_status" AS ENUM('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."step_type" AS ENUM('UPLOAD', 'PARSE', 'PROFILING', 'CLEANING', 'COLUMN_DETECTION', 'SUMMARIZATION', 'CHART_RECOMMENDATION', 'TRANSFORM_GENERATION', 'CHART_CONFIG_GENERATION', 'RENDERING', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('PRIVATE', 'TEAM', 'PUBLIC', 'LINK');--> statement-breakpoint
CREATE TABLE "chart_share_links" (
	"id" varchar PRIMARY KEY NOT NULL,
	"chart_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp,
	"created_by_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chart_share_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "chart_versions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"chart_id" varchar NOT NULL,
	"config" json NOT NULL,
	"notes" varchar,
	"created_by_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "charts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"library" chart_library DEFAULT 'ECHARTS' NOT NULL,
	"config" json NOT NULL,
	"data_spec" json,
	"generation_steps" json,
	"user_id" varchar,
	"team_id" varchar,
	"folder_id" varchar,
	"file_id" varchar,
	"visibility" "visibility" DEFAULT 'PRIVATE' NOT NULL,
	"slug" varchar NOT NULL,
	"conversation_id" varchar,
	"message_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "charts_slug_unique" UNIQUE("slug"),
	CONSTRAINT "charts_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"user_id" varchar,
	"team_id" varchar,
	"file_id" varchar,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"content" json,
	"role" "message_role" NOT NULL,
	"conversation_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"kind" "file_kind" NOT NULL,
	"mime_type" varchar,
	"size" integer,
	"url" varchar,
	"provider" varchar,
	"bucket" varchar,
	"key" varchar,
	"checksum" varchar,
	"user_id" varchar,
	"team_id" varchar,
	"folder_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "files_folder_id_name_unique" UNIQUE("folder_id","name")
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"user_id" varchar,
	"team_id" varchar,
	"parent_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "folders_user_id_team_id_parent_id_name_unique" UNIQUE("user_id","team_id","parent_id","name")
);
--> statement-breakpoint
CREATE TABLE "team_invites" (
	"id" varchar PRIMARY KEY NOT NULL,
	"team_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"role" "role" DEFAULT 'VIEWER' NOT NULL,
	"token" varchar NOT NULL,
	"status" "invite_status" DEFAULT 'PENDING' NOT NULL,
	"inviter_id" varchar NOT NULL,
	"expires_at" timestamp,
	"accepted_by_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "team_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" varchar PRIMARY KEY NOT NULL,
	"team_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" "role" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_team_id_user_id_unique" UNIQUE("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_by_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"clerk_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chart_share_links" ADD CONSTRAINT "chart_share_links_chart_id_charts_id_fk" FOREIGN KEY ("chart_id") REFERENCES "public"."charts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chart_versions" ADD CONSTRAINT "chart_versions_chart_id_charts_id_fk" FOREIGN KEY ("chart_id") REFERENCES "public"."charts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_accepted_by_id_users_id_fk" FOREIGN KEY ("accepted_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chart_share_links_chart_id_idx" ON "chart_share_links" USING btree ("chart_id");--> statement-breakpoint
CREATE INDEX "chart_share_links_created_by_id_idx" ON "chart_share_links" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "chart_versions_chart_id_idx" ON "chart_versions" USING btree ("chart_id");--> statement-breakpoint
CREATE INDEX "charts_user_id_idx" ON "charts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "charts_team_id_idx" ON "charts" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "charts_folder_id_idx" ON "charts" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "charts_file_id_idx" ON "charts" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "charts_conversation_id_idx" ON "charts" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "charts_message_id_idx" ON "charts" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversations_team_id_idx" ON "conversations" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "conversations_file_id_idx" ON "conversations" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "files_user_id_idx" ON "files" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "files_team_id_idx" ON "files" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "files_folder_id_idx" ON "files" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "folders_user_id_idx" ON "folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "folders_team_id_idx" ON "folders" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "folders_parent_id_idx" ON "folders" USING btree ("parent_id");