CREATE PROCEDURE `cmm_GetPaging`(
		IN pTotalRecord INT
        ,IN pOffset INT
        ,IN pLimit INT
        ,OUT pStartIndex INT
        ,OUT pEndIndex INT
        )
BEGIN
	/*
		CALL cmm_GetPaging(10,1,5, @vStartIndex, @vEndIndex);
        SELECT @vStartIndex, @vEndIndex;
    */
	SET pEndIndex := pTotalRecord - pOffset;
    SET pStartIndex := pEndIndex - pLimit + 1;
	
    IF pEndIndex <= 0 THEN
		SET pEndIndex := 999999;
        SET pStartIndex := 0;
    END IF;
    
    SET pStartIndex := IF(pStartIndex < 0, 0, pStartIndex);
    
END