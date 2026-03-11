CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(320) NOT NULL,
  `pickupLocation` varchar(500) NOT NULL,
  `dropoffLocation` varchar(500) NOT NULL,
  `travelDate` varchar(20) NOT NULL,
  `travelTime` varchar(10) NOT NULL,
  `passengers` int NOT NULL,
  `luggage` int NOT NULL,
  `preferredContactMethod` enum('whatsapp', 'email', 'phone', 'line', 'telegram') NOT NULL DEFAULT 'whatsapp',
  `notes` text,
  `status` enum('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `notificationsSent` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
