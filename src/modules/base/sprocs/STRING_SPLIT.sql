CREATE PROCEDURE `STRING_SPLIT`(IN pStrSplit varchar(7000), IN pDelimiter varchar(5))
BEGIN
	/*
    CALL STRING_SPLIT('a,b,b',',');
    SELECT val FROM STRING_SPLIT;
    */
	DROP TEMPORARY TABLE IF EXISTS STRING_SPLIT;
	CREATE TEMPORARY TABLE STRING_SPLIT (
		val varchar(128),
		index val1(val)
	);

	SET @Occurrences = LENGTH(pStrSplit) - LENGTH(REPLACE(pStrSplit, pDelimiter, ''));
myloop:
	WHILE (@Occurrences > 0)
	DO
		SET @myValue = SUBSTRING_INDEX(pStrSplit, pDelimiter, 1);
		IF (@myValue != '') THEN
			INSERT INTO STRING_SPLIT
			VALUES (@myValue);
		ELSE
			LEAVE myloop;
		END IF;
        
		SET @Occurrences = LENGTH(pStrSplit) - LENGTH(REPLACE(pStrSplit, pDelimiter, ''));
        
		IF (@occurrences = 0) THEN
			LEAVE myloop;
		END IF;
            
		SET pStrSplit = SUBSTRING(pStrSplit, LENGTH(SUBSTRING_INDEX(pStrSplit, pDelimiter, 1)) + 2);
        
	END WHILE;

	IF LENGTH(pStrSplit) > 0 AND NOT EXISTS (SELECT 1 FROM STRING_SPLIT) THEN
		INSERT INTO STRING_SPLIT
		VALUES (pStrSplit);
	END IF;
END