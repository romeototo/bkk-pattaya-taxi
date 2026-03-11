CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pickupLocation` varchar(500) NOT NULL,
	`dropoffLocation` varchar(500) NOT NULL,
	`date` varchar(20) NOT NULL,
	`time` varchar(10) NOT NULL,
	`passengers` int NOT NULL,
	`luggage` int NOT NULL,
	`contact` varchar(320) NOT NULL,
	`contactMethod` enum('whatsapp','email','phone') NOT NULL DEFAULT 'whatsapp',
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
