DELIMITER //
CREATE PROCEDURE getUserByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT u.FirstName,u.LastName,u.Dni, u.Address,u.Phone,u.Mail,u.BirthDate
	FROM user u
	WHERE u.Rol=0 AND u.DateCreated >= Inicio AND u.DateCreated <= Fin; 
END//
DELIMITER ;

CALL getUserByDateRange('2024-07-01', '2024-07-30');

DELIMITER //
CREATE PROCEDURE getLastShipment(IN userId INT) 
BEGIN 
	SELECT * FROM shipment WHERE IdUser=userId 
    	ORDER BY DateAdd DESC LIMIT 1; 
END//
DELIMITER ;

CALL getLastShipment('7');

DELIMITER //
CREATE PROCEDURE getSalesByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT s.IdSales,u.FirstName,u.LastName,s.ShippingMethod,s.PaymentMethod,s.Total,s.ImagePayment,s.SaleDate
	FROM sale s
    INNER JOIN user u on s.userId=u.IdUser
	WHERE s.SaleDate >= Inicio AND s.SaleDate <= Fin; 
END//
DELIMITER ;
CALL getSalesByDateRange('2024-07-01', '2024-07-31');
