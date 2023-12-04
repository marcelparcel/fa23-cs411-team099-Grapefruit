
DELIMITER $$
CREATE TRIGGER CheckStopsPicked
    BEFORE Update 
    ON StopsPicked FOR EACH ROW


BEGIN
    IF OLD.StopId1 IS NOT NULL AND OLD.StopId2 IS NULL THEN
        SET NEW.StopId2 = NEW.StopId1;
        SET NEW.StopId1 = OLD.StopId1;
    ELSEIF OLD.StopId1 IS NULL AND OLD.StopId2 IS NOT NULL THEN
        SET NEW.StopId2 = OLD.StopId2;
    ELSE OLD.StopId1 IS NOT NULL AND OLD.StopId2 IS NOT NULL THEN
        SET NEW.StopId2 = OLD.StopId2;
    End If;
END$$
DELIMITER ;

Insert Into StopsPicked(Email, StopId1, StopId2)
Values (michellezhang11182@gmail.com,18847), 
        (hi@gmail.com,18849,18850);

