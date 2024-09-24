import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { NIM, NamaMahasiswa, Kelas, Email } = req.body;

    const student = await prisma.mahasiswa.create({
      data: { NIM, NamaMahasiswa, Kelas, Email },
    });

    res.status(201).json({ student });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
