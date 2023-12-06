
DELIMITER $$
CREATE TRIGGER CheckStopsPicked
    BEFORE Update 
    ON StopsPicked FOR EACH ROW


BEGIN
    -- IF OLD.StopId1 IS NOT NULL AND OLD.StopId2 IS NULL THEN
    --     SET NEW.StopId2 = NEW.StopId1;
    --     SET NEW.StopId1 = OLD.StopId1;
    -- ELSEIF OLD.StopId1 IS NULL AND OLD.StopId2 IS NOT NULL THEN
    --     /* NEW.StopId1 = NEW.StopId1*/
    --     SET NEW.StopId2 = OLD.StopId2;
    IF OLD.StopId1 IS NOT NULL AND OLD.StopId2 IS NOT NULL THEN
        /* NEW.StopId1 = NEW.StopId1*/
        SET NEW.StopId2 = OLD.StopId1;
    End If;
END$$
DELIMITER ;


