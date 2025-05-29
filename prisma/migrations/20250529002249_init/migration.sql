-- CreateTable
CREATE TABLE "tarefas" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descricao" VARCHAR(250) NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "data_termino" DATE,
    "status" VARCHAR(40) DEFAULT 'PENDENTE',
    "titulo" VARCHAR(40),
    "prioridade" VARCHAR(40) DEFAULT 'MEDIA',

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(40) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "ativo" BOOLEAN DEFAULT true,
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
