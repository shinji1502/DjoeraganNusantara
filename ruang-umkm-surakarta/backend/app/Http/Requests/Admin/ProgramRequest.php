<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $startRules = ['required', 'date'];
        if ($this->isMethod('post')) {
            $startRules[] = 'after_or_equal:today';
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:10000'],
            'organizer' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => $startRules,
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'registration_start' => ['nullable', 'date'],
            'registration_end' => ['nullable', 'date', 'after_or_equal:registration_start', 'before_or_equal:end_date'],
            'quota' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'status' => ['required', Rule::in(['draft', 'published', 'ongoing', 'completed', 'cancelled'])],
        ];
    }
}