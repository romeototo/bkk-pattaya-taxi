CREATE TABLE `notificationSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminLineToken` varchar(500),
	`adminEmailEnabled` enum('true','false') NOT NULL DEFAULT 'true',
	`adminTelegramChatId` varchar(100),
	`userEmailNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyOnConfirmed` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyOnCompleted` enum('true','false') NOT NULL DEFAULT 'true',
	`notifyOnCancelled` enum('true','false') NOT NULL DEFAULT 'true',
	`enableScheduledNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`scheduledNotificationMinutesBefore` int NOT NULL DEFAULT 60,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationSettings_id` PRIMARY KEY(`id`)
);
