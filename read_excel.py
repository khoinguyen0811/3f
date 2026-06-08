import pandas as pd
import json
import sys

# Set UTF-8 encoding for output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Read the Excel file
df = pd.read_excel('3F_Store_Vi_t_Nam__Online_Shop___Shopee__shopee_2026-06-04.xlsx')

# Write column names to file
with open('excel_info.txt', 'w', encoding='utf-8') as f:
    f.write("Columns: " + str(df.columns.tolist()) + "\n\n")
    f.write("Shape: " + str(df.shape) + "\n\n")
    f.write("First 5 rows:\n")
    f.write(df.head().to_string() + "\n\n")

# Convert to JSON for easier use
products_json = df.to_json(orient='records', force_ascii=False, indent=2)

# Save to a file
with open('products.json', 'w', encoding='utf-8') as f:
    f.write(products_json)

print("Done! Check products.json and excel_info.txt")
