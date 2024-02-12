-- MODIFY ON 12-02-2024 --
ALTER TABLE `md_user` ADD `comp_id` INT(11) NOT NULL AFTER `id`;
ALTER TABLE `md_user` ADD `first_login` ENUM('Y','N') NOT NULL DEFAULT 'Y' AFTER `active_flag`, ADD `last_login` DATETIME NULL DEFAULT NULL AFTER `first_login`;
ALTER TABLE `md_user` CHANGE `moified_dt` `modified_dt` DATETIME NULL DEFAULT NULL;
ALTER TABLE `td_collection` ADD `comp_id` INT(11) NOT NULL DEFAULT '1' AFTER `id`;

-- END --