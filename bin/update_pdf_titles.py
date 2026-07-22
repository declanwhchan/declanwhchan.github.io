from pathlib import Path

from pypdf import PdfReader, PdfWriter

pdf_directory = Path("assets/pdf/ib")

for pdf_path in sorted(pdf_directory.rglob("*.pdf")):
    title = pdf_path.stem
    reader = PdfReader(pdf_path)

    current_title = ""
    if reader.metadata:
        current_title = reader.metadata.get("/Title", "")

    if current_title == title:
        print(f'Already correct: "{pdf_path.name}"')
        continue

    temporary_path = pdf_path.with_suffix(".temporary.pdf")

    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.add_metadata(
        {
            "/Title": title,
            "/Author": "Declan Chan",
        }
    )

    with temporary_path.open("wb") as output:
        writer.write(output)

    temporary_path.replace(pdf_path)
    print(f'Updated "{pdf_path.name}" to "{title}"')
