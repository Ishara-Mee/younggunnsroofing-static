
(function ($) {
    'use strict';

    var contactForm = {
        form: '#form',
        invalidCls: 'is-invalid',
        validation: '[name="username"],[name="email"],[name="phone"],[name="address1"],[name="form_work_type"],[name="message"]',
        emailField: '[name="email"]',
        messages: $('<p class="form-messages mb-0 mt-3"></p>'),

        emailjsConfig: {
            serviceId: 'service_ypxzbva',
            templateId: 'template_538mfhj',
            publicKey: 'KeeDIZDTSrheB0Ymz'
        },

        init: function () {
            // Append messages container if not exists
            if ($(this.form + ' .form-messages').length === 0) {
                $(this.form).append(this.messages);
            } else {
                this.messages = $(this.form + ' .form-messages');
            }

            this.bindEvents();
        },

        bindEvents: function () {
            var self = this;

            $(this.form).on('submit', function (e) {
                e.preventDefault(); // Prevent page reload
                self.handleSubmit();
            });
        },

        handleSubmit: function () {
            if (this.validateForm()) {
                this.showLoading();

                var formData = {
                    username: $(this.form + ' [name="username"]').val().trim(),
                    email: $(this.form + ' [name="email"]').val().trim(),
                    phone: $(this.form + ' [name="phone"]').val().trim(),
                    address1: $(this.form + ' [name="address1"]').val().trim(),
                    work_type: $(this.form + ' [name="form_work_type"]').val(),
                    message: $(this.form + ' [name="message"]').val().trim()
                };

                console.log('Form Data:', formData); // Debug

                this.sendWithEmailJS(formData);
            }
        },

        validateForm: function () {
            var isValid = true;
            var self = this;

            // Remove previous invalid classes
            $(this.form + ' input, ' + this.form + ' textarea, ' + this.form + ' select').removeClass(this.invalidCls);

            var fields = this.validation.split(',');

            fields.forEach(function (field) {
                var $field = $(self.form + ' ' + field.trim());
                if (!$field.val() || !$field.val().trim()) {
                    $field.addClass(self.invalidCls);
                    isValid = false;
                }
            });

            // Validate email format
            var emailValue = $(this.form + ' ' + this.emailField).val().trim();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                $(this.form + ' ' + this.emailField).addClass(this.invalidCls);
                isValid = false;
            }

            if (!isValid) {
                this.showError('Please fill all required fields correctly.');
            }

            return isValid;
        },

        showLoading: function () {
            this.messages.removeClass('error success').addClass('loading');
            this.messages.html('Sending your message...');
            $(this.form + ' button[type="submit"]').prop('disabled', true);
        },

        showSuccess: function () {
            this.messages.removeClass('error loading').addClass('success');
            this.messages.html('Message sent successfully!');
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },

        showError: function (message) {
            this.messages.removeClass('success loading').addClass('error');
            this.messages.html(message);
            $(this.form + ' button[type="submit"]').prop('disabled', false);
        },

        clearForm: function () {
            $(this.form)[0].reset();
            $(this.form + ' input, textarea, select').removeClass(this.invalidCls);
        },

        sendWithEmailJS: function (formData) {
            var self = this;

            emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                {
                    to_name: "Young Gunns Roofing",
                    to_email: "younggunnsroofing@gmail.com",
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address1, // Fixed
                    work_type: formData.work_type,
                    message: formData.message,
                    reply_to: formData.email
                },
                this.emailjsConfig.publicKey
            ).then(function (response) {
                console.log("Email Sent", response);
                self.showSuccess();
                self.clearForm();
            }, function (error) {
                console.error("Email Error", error);
                self.showError("Failed to send message. Please try again.");
            });
        }
    };

    $(document).ready(function () {
        if (contactForm.emailjsConfig.publicKey) {
            emailjs.init(contactForm.emailjsConfig.publicKey);
        }
        contactForm.init();
    });

})(jQuery);
