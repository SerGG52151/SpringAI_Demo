package com.sergio.springaidemo.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatMessage(
        @NotBlank String role,
        @NotBlank String content) {
}
