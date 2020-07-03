package info.teddylazebnik.mobileversion

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity


class MainActivity : AppCompatActivity() {

    val EXTRA_MESSAGE = "info.teddylazebnik.mobileversion.MESSAGE"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Get the Intent that started this activity and extract the string
        openWebView(intent.getStringExtra(EXTRA_MESSAGE))
    }

    /*
        Open the website's on full screen as the application
     */
    private fun openWebView(pageUrl: String)
    {
        val mWebView = findViewById<WebView>(R.id.website)
        val webSettings = mWebView.settings
        webSettings.javaScriptEnabled = true
        mWebView.loadUrl(pageUrl)
        mWebView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (Uri.parse(url).host == "teddylazebnik.info") {
                    return false
                }
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
                return true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // remove personal card - no need in app version
                /*
                mWebView.loadUrl(
                    "javascript:(function() { try { var personalCard = document.getElementById('personal_card'); element.parentNode.removeChild(element); } catch (error) {console.log('Android App personal card not found')}})()"
                )
                */
                mWebView.loadUrl("javascript:(".plus(ReadFile("website_personal_card.js")).plus(")()"))
            }
        }
        WebView.setWebContentsDebuggingEnabled(false)
    }

    private fun ReadFile(fileName: String): String{
        return application.assets.open(fileName).bufferedReader().use { it.readText() }
    }
}