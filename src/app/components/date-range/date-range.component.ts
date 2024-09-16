import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

interface FormattedDate {
  day: string;
  month: string;
  year: string;
}

@Component({
  selector: 'app-date-range',
  standalone: true,
  imports: [NgClass, NgIf, NgForOf],
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.scss',
})
export class DateRangeComponent implements OnChanges {
  @Input() dates: Date[] = [];

  formattedDates: FormattedDate[] = [];
  isDateRange: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dates']) {
      this.updateFormattedDates();
    }
  }

  private updateFormattedDates(): void {
    if (this.dates.length === 0) {
      this.formattedDates = [];
      this.isDateRange = false;
      return;
    }

    const sortedDates = this.dates.sort((a, b) => a.getTime() - b.getTime());
    const uniqueDates = [
      ...new Set(sortedDates.map((d) => d.toDateString())),
    ].map((d) => new Date(d));

    if (uniqueDates.length === 1) {
      this.formattedDates = [this.formatDate(uniqueDates[0])];
      this.isDateRange = false;
    } else {
      const firstDate = this.formatDate(uniqueDates[0]);
      const lastDate = this.formatDate(uniqueDates[uniqueDates.length - 1]);
      this.formattedDates = [firstDate, lastDate];
      this.isDateRange = true;
    }
  }

  private formatDate(date: Date): FormattedDate {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    return {
      day: parts.find((part) => part.type === 'day')?.value || '',
      month:
        parts.find((part) => part.type === 'month')?.value.replace('.', '') ||
        '',
      year: parts.find((part) => part.type === 'year')?.value || '',
    };
  }
}
