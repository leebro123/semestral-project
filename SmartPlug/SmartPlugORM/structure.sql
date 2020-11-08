CREATE TABLE emeter (
	id INT PRIMARY KEY,
	voltage INT NOT NULL,
	current INT NOT NULL,
	power INT NOT NULL,
	created_at DATETIME NOT NULL
);
