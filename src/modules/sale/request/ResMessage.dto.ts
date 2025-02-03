export class ResMessage {
    Message: string = 'No se logró completar la petición';
    Value: object = null;
    Success: boolean = false;
    Error?: string = '';
  
    resultOK(msg: string) {
      this.Message = msg;
      this.Success = true;
    }
  
    resultFail(msg: string) {
      this.Message = msg;
      this.Success = false;  // Corregir aquí
    }
  }