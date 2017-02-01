const rootPath = 'http://localhost:9090'

const errHandler = (e) => {
  console.error(e)
}

const xhr = ({ url, body = null, method = 'get' }) => {
  const defer = $.Deferred()

  $.ajax({
    type: method,
    url: rootPath + url,
    data: body
    // xhrFields: { // 跨域允许带上 cookie
    //   withCredentials: [域名]
    // },
    // crossDomain: true
  })
  .done((result) => {
    if (!result) {
      errHandler('no result')
    } else if (result.Code !== 0) {
      errHandler(result.Msg)
    } else {
      defer.resolve(result.Data)
    }
  })
  .fail(errHandler)

  return defer.promise()
}

export default xhr
