import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { NIM } = req.query;

  if (req.method === 'DELETE') {
    await prisma.mahasiswa.delete({ where: { NIM } });
    res.status(204).end();
  } else if (req.method === 'PUT') {
    const { NamaMahasiswa, Kelas, Email } = req.body;
    const updatedStudent = await prisma.mahasiswa.update({
      where: { NIM },
      data: { NamaMahasiswa, Kelas, Email },
    });
    res.status(200).json({ updatedStudent });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
