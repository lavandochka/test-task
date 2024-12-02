export async function GET(request: Request) {
    console.log(111)
    return Response.json({ ok: true })
}

// mongodb+srv://julia:<db_password>@cluster0.zspxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0