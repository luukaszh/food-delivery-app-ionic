import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum ToastColor {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
  Primary = 'primary',
  Secondary = 'secondary',
  Light = 'light',
  Dark = 'dark',
  Medium = 'medium',
  Tertiary = 'tertiary'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
  ) { }

  async showToast(message: string, color: ToastColor, text = 'OK') {
    console.log('ToastService | Show toast');
    
    await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color,
      buttons: [{
        text,
      }]
    }).then(res => res.present());
  }
}
