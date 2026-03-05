(function($) {
'use strict';

var contactForm = {
    form: '#contact-form',
    invalidCls: 'is-invalid',
    validation: '[name="username"],[name="email"],[name="phone"],[name="message"]',
    emailField: '[name="email"]',
    messages: $('<p class="form-messages mb-0 mt-3"></p>'),

    emailjsConfig: {
        serviceId: 'service_ypxzbva',
        templateId: 'template_lrb1mmk',
        publicKey: 'KeeDIZDTSrheB0Ymz'
    },

    init: function() {

        if ($(this.form + ' .form-messages').length === 0) {
            $(this.form).append(this.messages);
        } else {
            this.messages = $(this.form + ' .form-messages');
        }

        this.bindEvents();
    },

    bindEvents: function() {
        var self = this;

        $(this.form).on('submit', function(e) {
            e.preventDefault();
            self.handleSubmit();
        });
    },

    handleSubmit: function() {

        if (this.validateForm()) {

            this.showLoading();

            var formData = {
                username: $(this.form + ' [name="username"]').val(),
                email: $(this.form + ' [name="email"]').val(),
                phone: $(this.form + ' [name="phone"]').val(),
                work_type: $(this.form + ' [name="form_work_type"]').val(),
                message: $(this.form + ' [name="message"]').val()
            };

            this.sendWithEmailJS(formData);
        }
    },

    validateForm: function() {

        var isValid = true;
        var self = this;

        $(this.form + ' input, ' + this.form + ' textarea, ' + this.form + ' select')
        .removeClass(this.invalidCls);

        var fields = this.validation.split(',');

        fields.forEach(function(field) {

            var $field = $(self.form + ' ' + field.trim());

            if (!$field.val().trim()) {
                $field.addClass(self.invalidCls);
                isValid = false;
            }

        });

        var emailValue = $(this.form + ' ' + this.emailField).val();
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

    showLoading: function() {

        this.messages.removeClass('error success');
        this.messages.addClass('loading');
        this.messages.html('Sending your message...');

        $(this.form + ' button[type="submit"]').prop('disabled', true);
    },

    showSuccess: function() {

        this.messages.removeClass('error loading');
        this.messages.addClass('success');

        this.messages.html('Message sent successfully!');

        $(this.form + ' button[type="submit"]').prop('disabled', false);
    },

    showError: function(message) {

        this.messages.removeClass('success loading');
        this.messages.addClass('error');

        this.messages.html(message);

        $(this.form + ' button[type="submit"]').prop('disabled', false);
    },

    clearForm: function() {

        $(this.form)[0].reset();
        $(this.form + ' input, textarea, select').removeClass(this.invalidCls);
    },

    sendWithEmailJS: function(formData) {

        var self = this;

        emailjs.send(
            this.emailjsConfig.serviceId,
            this.emailjsConfig.templateId,
            {
                to_name: "Young Gunns Roofing",
                to_email: "admin1@gmail.com,admin2@gmail.com",

                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                work_type: formData.work_type,
                message: formData.message,

                reply_to: formData.email
            },
            this.emailjsConfig.publicKey

        ).then(function(response) {

            console.log("Email Sent", response);

            self.showSuccess();
            self.clearForm();

        }, function(error) {

            console.log("Email Error", error);

            self.showError("Failed to send message. Please try again.");

        });
    }

};

$(document).ready(function() {

    if (contactForm.emailjsConfig.publicKey) {
        emailjs.init(contactForm.emailjsConfig.publicKey);
    }

    contactForm.init();

});

})(jQuery);