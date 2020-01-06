
--- 触发器与表结构相关
--- 由于typeorm 生成的表结构十分诡异，则建议 取消typeorm 自动同步表结构

use chat;

CREATE TRIGGER `user_statu_auto_trigger` AFTER INSERT ON `user_info` 

		FOR EACH ROW

			BEGIN

					INSERT INTO `user_status` (email) VALUES (NEW.email);

			END;