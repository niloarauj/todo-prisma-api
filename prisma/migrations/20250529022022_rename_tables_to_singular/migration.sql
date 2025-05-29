/*
  Warnings:

  - You are about to drop the `tarefas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tarefas" DROP CONSTRAINT "tarefas_id_usuario_fkey";

-- DropTable
DROP TABLE "tarefas";

-- DropTable
DROP TABLE "usuarios";

-- CreateTable
CREATE TABLE "tarefa" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descricao" VARCHAR(250) NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "data_termino" DATE,
    "status" VARCHAR(40) DEFAULT 'PENDENTE',
    "titulo" VARCHAR(40),
    "prioridade" VARCHAR(40) DEFAULT 'MEDIA',

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(40) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "ativo" BOOLEAN DEFAULT true,
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
