CREATE DATABASE `chat`;

USE `chat`;

CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id` INT(4) NOT NULL AUTO_INCREMENT UNIQUE,
    --  电子邮件
    `email` VARCHAR(50) NOT NULL LIKE '%@.%' PRIMARY KEY,
    --  昵称
    `nickname` CHAR(20) NOT NULL,
    --  性别 0 表示未知 1表示
    `gender` TINYINT DEFAULT 0 CHECK(`gender` in (0, 1, 2)),
    --  生日日期
    `birthday` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    --  出生地
    `birthplace` VARCHAR(100),
    --  个人说明
    `signature` VARCHAR(200)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1001;

CREATE TABLE IF NOT EXISTS `user_status` (
    `email` VARCHAR(50) NOT NULL PRIMARY KEY,
    --  创建时间
    `creat_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    --  最后修改时间
    `last_revise_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    --  用户状态
    `user_status` BIT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY(`email`) REFERENCES `user_info`(email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `chat_record` (
    `chat_record` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `send_user` INT(4) NOT NULL,
    `receive_user` INT(4) NOT NULL,
    `mesg` VARCHAR(255),
    `type` BIt(1),
    FOREIGN KEY(`send_user`) REFERENCES `user_info`(user_id),
    FOREIGN KEY(`receive_user`) REFERENCES `user_info`(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- 触发器
CREATE TRIGGER `user_status_insert_auto_trigger`
AFTER
INSERT
    ON `user_info` FOR EACH ROW BEGIN
INSERT INTO
    `user_status` (email)
VALUES
    (NEW.email);

END;

INSERT INTO
    `chat`.`user_info`(
        `user_id`,
        `email`,
        `nickname`,
        `gender`,
        `birthday`,
        `birthplace`,
        `signature`
    )
VALUES
    (
        NULL,
        '990183536@qq.com',
        '1',
        2,
        CURRENT_TIMESTAMP,
        '1',
        '1'
    ) -- DROP TABLE `chat_record` ;
    -- DROP TABLE `user_status` ;
    -- DROP TABLE   `user_info` ;