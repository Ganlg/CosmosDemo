from django import forms


class EmailPostForm(forms.Form):
    name = forms.CharField(required=True, max_length=40)
    email = forms.EmailField(required=True)
    comments = forms.CharField(required=True)
