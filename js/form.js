(function ($) {
    'use strict';

    var contactForm = {
        form: '#form, #contact-form', // target both forms
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
            $(this.form).each((i, f) => {
                const $f = $(f);
                if ($f.find('.form-messages').length === 0) {
                    $f.append(this.messages.clone());
                }
            });
            this.bindEvents();
        },

        bindEvents: function () {
            var self = this;
            $(this.form).on('submit', function (e) {
                e.preventDefault();
                self.handleSubmit($(this));
            });
        },

        handleSubmit: function ($form) {
            if (this.validateForm($form)) {
                this.showLoading($form);

                var formData = {
                    username: $form.find('[name="username"]').val().trim(),
                    email: $form.find('[name="email"]').val().trim(),
                    phone: $form.find('[name="phone"]').val().trim(),
                    address1: $form.find('[name="address1"]').val().trim(),
                    work_type: $form.find('[name="form_work_type"]').val(),
                    message: $form.find('[name="message"]').val().trim()
                };

                console.log('Form Data:', formData);

                this.sendWithEmailJS($form, formData);
            }
        },

        validateForm: function ($form) {
            var isValid = true;
            $form.find('input, textarea, select').removeClass(this.invalidCls);

            var fields = this.validation.split(',');
            fields.forEach(f => {
                const $field = $form.find(f.trim());
                if (!$field.val() || !$field.val().trim()) {
                    $field.addClass(this.invalidCls);
                    isValid = false;
                }
            });

            const emailValue = $form.find(this.emailField).val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                $form.find(this.emailField).addClass(this.invalidCls);
                isValid = false;
            }

            if (!isValid) {
                this.showError($form, 'Please fill all required fields correctly.');
            }

            return isValid;
        },

        showLoading: function ($form) {
            const $msg = $form.find('.form-messages');
            $msg.removeClass('error success').addClass('loading').html('Sending your message...');
            $form.find('button[type="submit"]').prop('disabled', true);
        },

        showSuccess: function ($form) {
            const $msg = $form.find('.form-messages');
            $msg.removeClass('error loading').addClass('success').html('Message sent successfully!');
            $form.find('button[type="submit"]').prop('disabled', false);
            $form[0].reset();
        },

        showError: function ($form, message) {
            const $msg = $form.find('.form-messages');
            $msg.removeClass('success loading').addClass('error').html(message);
            $form.find('button[type="submit"]').prop('disabled', false);
        },

        sendWithEmailJS: function ($form, formData) {
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
                    address: formData.address1,
                    work_type: formData.work_type,
                    message: formData.message,
                    reply_to: formData.email
                },
                this.emailjsConfig.publicKey
            ).then(function (response) {
                console.log("Email Sent", response);
                self.showSuccess($form);
            }, function (error) {
                console.error("Email Error", error);
                self.showError($form, "Failed to send message. Please try again.");
            });
        }
    };

    $(document).ready(function () {
        emailjs.init(contactForm.emailjsConfig.publicKey);
        contactForm.init();
    });

})(jQuery);