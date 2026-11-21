import { HttpException, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

// Envía un mensaje a un microservicio y espera su respuesta
export async function callService<T>(
  client: ClientProxy, // a qué servicio
  pattern: string, // qué mensaje
  data: unknown, // con qué datos
): Promise<T> {
  try {
    // send() envía el mensaje. timeout(3000): como mucho esperamos 3 segundos
    const response = client.send<T>(pattern, data).pipe(timeout(3000));
    // firstValueFrom() lo convierte en una promesa, para poder usar await
    return await firstValueFrom(response);
  } catch (error) {
    // El servicio respondió con un error suyo (por ejemplo, un 404)
    if (isServiceError(error)) {
      throw new HttpException(error.message, error.statusCode);
    }
    // El servicio está apagado o tarda demasiado
    throw new ServiceUnavailableException('El servicio no responde');
  }
}

// ¿El error trae un statusCode y un message? Entonces lo lanzó el servicio
function isServiceError(
  error: unknown,
): error is { statusCode: number; message: string } {
  return typeof error === 'object' && error !== null && 'statusCode' in error;
}
