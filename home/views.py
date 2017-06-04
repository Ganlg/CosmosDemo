from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.core.mail import send_mail


from .forms import EmailPostForm
from tools.decorators import ajax_required


# Create your views here.


def index(request):
    return render(request, 'home/index.html')

@ajax_required
@require_POST
def contact(request):
    # customer_name = request.POST.get('customer_name')
    # customer_email = request.POST.get('customer_email')
    # comments = request.POST.get('comments')
    #
    # email_form = EmailPostForm(initial={
    #     'name': customer_name,
    #     'email': customer_email,
    #     'comments': comments
    # })
    # print(customer_name, customer_email, comments)
    email_form = EmailPostForm(request.POST)

    if email_form.is_valid():
        cd = email_form.cleaned_data
        subject = 'Important Message from Potential Customer {0}, {1}'.format(cd['name'], cd['email'])
        message = cd['comments']
        email_from = 'service@tekkbrand.com'
        email_to_list = ['service@tekkbrand.com', 'ganliu@tekkbrand.com']

        try:
            send_mail(subject=subject, message=message, from_email=email_from, recipient_list=email_to_list)
        except:
            return JsonResponse({
                'status': 'email fail',
                'errors': 'Our server has an error, please email us directly. Sorry for the inconvenience.'
            })
        return JsonResponse({'status': 'success'}, safe=False)
    else:
        return JsonResponse({
            'status': 'fail',
            'errors': email_form.errors
        }, safe=False)
