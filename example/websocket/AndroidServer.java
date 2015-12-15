package websocket;

import java.util.ArrayList;
import java.util.List;

import com.koushikdutta.async.callback.CompletedCallback;
import com.koushikdutta.async.http.WebSocket;
import com.koushikdutta.async.http.WebSocket.StringCallback;
import com.koushikdutta.async.http.server.AsyncHttpServer;
import com.koushikdutta.async.http.server.AsyncHttpServer.WebSocketRequestCallback;
import com.koushikdutta.async.http.server.AsyncHttpServerRequest;
import com.koushikdutta.async.http.server.AsyncHttpServerResponse;
import com.koushikdutta.async.http.server.HttpServerRequestCallback;

// androidasync
public class AndroidServer {

  public static void main(String[] args) {
    AsyncHttpServer server = new AsyncHttpServer();
    final List<WebSocket> _sockets = new ArrayList<WebSocket>();
    server.get("/", new HttpServerRequestCallback() {
      @Override
      public void onRequest(AsyncHttpServerRequest request, AsyncHttpServerResponse response) {
        //response.getHeaders().add(header, value)
        response.send("Hello!!!");
      }
    }); // listen on port 5000
    server.websocket("/live", new WebSocketRequestCallback() {
      @Override
      public void onConnected(final WebSocket webSocket, AsyncHttpServerRequest request) {
        _sockets.add(webSocket); // Use this to clean up any references to your websocket
        webSocket.setClosedCallback(new CompletedCallback() {
          @Override
          public void onCompleted(Exception ex) {
            try {
              if (ex != null) ex.printStackTrace();
            } finally {
              _sockets.remove(webSocket);
            }
          }
        });

        webSocket.setStringCallback(new StringCallback() {
          @Override
          public void onStringAvailable(String s) {
            if ("Hello Server".equals(s)) webSocket.send("Welcome Client!");
          }
        });

        // ..Sometime later, broadcast!
         for (WebSocket socket : _sockets)
          socket.send("Fireball!");
      }
    });
    server.listen(5000); // browsing http://localhost:5000 will return Hello!!!
  }
}
