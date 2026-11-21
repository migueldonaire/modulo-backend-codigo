import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

// El "trabajador": va sacando tareas de la cola "emails" y las hace, una a una
@Processor('emails')
export class EmailsProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsProcessor.name);

  async process(job: Job<{ orderId: number }>) {
    this.logger.log(`Enviando el correo del pedido ${job.data.orderId}...`);

    // Hacemos como que enviar un correo tarda 3 segundos
    await new Promise((resolve) => setTimeout(resolve, 3000));

    this.logger.log(`Correo del pedido ${job.data.orderId} enviado`);
  }
}
