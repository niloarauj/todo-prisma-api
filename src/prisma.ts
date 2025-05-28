import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'] // Logs detalhados
})

// Função: Teste conexão com banco de dados
async function testConnection() {
    try {
        await prisma.$connect()
        console.log('Conexão estabelecida')
    } 
    
    catch (error) {
        console.log('Conexão NÃO foi estabelecida:', error)
    }
    
    finally {
        await prisma.$disconnect()
    }
}

testConnection()
    .then(() => console.log('Teste concluído'))
    .catch((e) => console.error('Teste deu erro:', e))

export default prisma