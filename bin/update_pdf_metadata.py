from pathlib import Path

from pypdf import PdfReader, PdfWriter

pdf_directory = Path("assets/pdf")

for pdf_path in sorted(pdf_directory.rglob("*.pdf")):
    title = pdf_path.stem
    temporary_path = pdf_path.with_suffix(".temporary.pdf")

    try:
        reader = PdfReader(pdf_path)

        current_title = ""
        current_author = ""

        if reader.metadata:
            current_title = reader.metadata.get("/Title", "") or ""
            current_author = reader.metadata.get("/Author", "") or ""

        if current_title == title and current_author == "Declan Chan":
            print(f'Already correct: "{pdf_path}"')
            continue

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
        print(f'Updated "{pdf_path}" to "{title}"')

    except Exception as error:
        if temporary_path.exists():
            temporary_path.unlink()

        print(f'Failed to update "{pdf_path}": {error}')
        raise
