require 'wuparty'

class PagesController < ApplicationController
  def landing
  end

  def wufoo
    account = 'shaunjohn'
    api_key = '9R6D-7KXW-08UV-ZPC6'
    form_id = 'z7x3x5'

    wufoo = WuParty.new(account, api_key)

    form = wufoo.form(form_id) # or details for a specific form

    result = form.submit(params[:app])

    render :json => result
  end

  def application
  end
end
