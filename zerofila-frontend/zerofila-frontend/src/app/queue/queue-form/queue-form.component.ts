import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-queue-form',
  standalone: true,
  imports: [FormsModule, CalendarModule, NgxMaskDirective, NgxMaskPipe, DropdownModule, InputNumberModule, CardModule, InputTextModule],
  templateUrl: './queue-form.component.html',
  styleUrl: './queue-form.component.scss'
})
export class QueueFormComponent {

}
