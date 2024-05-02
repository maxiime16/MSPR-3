import sqlite3

def extract_sqlite_schema(sqlite_db_paths):
    schemas = {}
    
    for db_path in sqlite_db_paths:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            schema = []
            
            for col in columns:
                col_name = col[1]
                col_type = col[2]
                col_nullable = "NOT NULL" if not col[3] else ""
                col_default = f"DEFAULT '{col[4]}'" if col[4] is not None else ""
                schema.append(f"{col_name} {col_type} {col_nullable} {col_default}")
            
            if table_name not in schemas:
                schemas[table_name] = schema
            else:
                schemas[table_name].extend(schema)
        
        conn.close()
    
    return schemas

def convert_to_postgresql_schema(sqlite_schemas):
    postgresql_schemas = {}
    
    for table_name, columns in sqlite_schemas.items():
        postgres_schema = []
        
        for column in columns:
            postgres_type = column.split()[1]
            
            if postgres_type.startswith("INT"):
                postgres_type = "INTEGER"
            elif postgres_type.startswith("VARCHAR") or postgres_type.startswith("TEXT"):
                postgres_type = "TEXT"
            elif postgres_type.startswith("REAL") or postgres_type.startswith("FLOAT"):
                postgres_type = "REAL"
            
            postgres_schema.append(column.replace("AUTOINCREMENT", "").replace(postgres_type, postgres_type.upper()))
        
        postgresql_schemas[table_name] = postgres_schema
    
    return postgresql_schemas

def generate_postgresql_sql(sqlite_schemas):
    with open("sqlite_to_postgresql.sql", "w") as f:
        for table_name, columns in sqlite_schemas.items():
            f.write(f"CREATE TABLE IF NOT EXISTS {table_name} (\n")
            f.write(",\n".join(columns))
            f.write("\n);\n\n")
    
    print("Conversion terminée. Le script SQL pour PostgreSQL a été enregistré dans un fichier.")

if __name__ == "__main__":
    sqlite_db_paths = ["./BackEnd/bdd/arosaje.db", "./Authentification/bdd/auth.db"]
    sqlite_schemas = extract_sqlite_schema(sqlite_db_paths)
    postgresql_schemas = convert_to_postgresql_schema(sqlite_schemas)
    generate_postgresql_sql(postgresql_schemas)
